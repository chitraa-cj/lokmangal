import xml.etree.ElementTree as ET
import json

def xml_to_dict(element):
    """Recursively convert XML element and its children to a dictionary."""
    node = {}
    if element.text and element.text.strip():
        node['text'] = element.text.strip()

    for key, value in element.attrib.items():
        node[f"@{key}"] = value  # Prefix attributes with '@'

    children = list(element)
    if children:
        grouped_children = {}
        for child in children:
            child_dict = xml_to_dict(child)
            tag = child.tag
            if tag in grouped_children:
                if isinstance(grouped_children[tag], list):
                    grouped_children[tag].append(child_dict)
                else:
                    grouped_children[tag] = [grouped_children[tag], child_dict]
            else:
                grouped_children[tag] = child_dict
        node.update(grouped_children)

    return node

def convert_large_xml_to_json(xml_file, json_file):
    tree = ET.parse(xml_file)
    root = tree.getroot()

    data_dict = {root.tag: xml_to_dict(root)}

    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(data_dict, f, indent=4, ensure_ascii=False)

# Usage
convert_large_xml_to_json("large_file.xml", "output.json")
